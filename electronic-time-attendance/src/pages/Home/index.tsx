import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table } from "reactstrap";
import { useAuth } from "../../contexts/AuthContext";
import { startWorkLogSession, endWorkLogSession, getWorkLogs, getActiveWorkLogSession } from "../../api/workLogs";
import "./style.css";
import { useNavigate } from "react-router-dom";
import PreviousDay from "../../types/timeFormatInterface";
import WorkLog from "../../types/workLog";
import logoutImg from './../../assets/images/logout.png';

const Home: React.FC = () => {
  const [isClockIn, setIsClockIn] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [previousDays, setPreviousDays] = useState<PreviousDay[]>([]);
  const { userId, token, name, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let startTime: number | null = null;

    const resumeTimer = () => {
      if (startTime) {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setCurrentTime(elapsedTime);
        intervalId = setInterval(() => {
          setCurrentTime(prevTime => prevTime + 1);
        }, 1000);
      }
    };

    const fetchWorkLogs = async () => {
      if (userId && token) {
        try {
          const workLogs = await getWorkLogs(userId, token);
          const formattedLogs = workLogs.map((log: WorkLog) => ({
            date: formatDate(log.date),
            hours: formatTime(log.hours),
            totalSeconds: log.hours,
          }));
          const uniqueLogs = formattedLogs.reduce((acc: WorkLog[], log: WorkLog) => {
            if (!acc.find((existingLog: { date: string; }) => existingLog.date === log.date)) {
              acc.push(log);
            }
            return acc;
          }, [] as PreviousDay[]);

          setPreviousDays(uniqueLogs);

          const activeSession = await getActiveWorkLogSession(userId, token);

          if (activeSession) {
            const now = new Date();
            const sessionDate = new Date(activeSession.startTime);

            const nowUTC = new Date(now.toISOString());
            const sessionDateUTC = new Date(sessionDate.toISOString());

            const initialTime = Math.floor((nowUTC.getTime() - sessionDateUTC.getTime()) / 1000);
            startTime = Date.now() - initialTime * 1000; 
            setCurrentTime(initialTime);
            setCurrentDate(formatDate(activeSession.startTime));
            setIsClockIn(true);

            const today = formatDate(now.toISOString());
            const todayExists = uniqueLogs.some((log: { date: string; }) => log.date === today);

            if (!todayExists) {
              setPreviousDays([
                { date: today, hours: formatTime(initialTime), totalSeconds: initialTime },
                ...uniqueLogs,
              ]);
            }
          } else {
            setCurrentTime(0);
          }

        } catch (error) {
          console.error("Error fetching work logs:", error);
        }
      }
    };

    fetchWorkLogs();

    window.addEventListener("focus", resumeTimer);

    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener("focus", resumeTimer);
    };
  }, [userId, token]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const handleClockIn = async (): Promise<void> => {
    const now = new Date();
    const date = now.toLocaleDateString("pt-BR");

    if (isClockIn) {
      setIsClockIn(false);

      const updatedDays = previousDays.map((day) =>
        day.date === currentDate
          ? {
              ...day,
              totalSeconds: day.totalSeconds + currentTime,
              hours: formatTime(day.totalSeconds + currentTime),
            }
          : day
      );
      setPreviousDays(updatedDays);

      try {
        if (userId && token) {
          await endWorkLogSession(userId, token, currentTime);
        }
      } catch (error) {
      }
    } else {
      setIsClockIn(true);
      const logExists = previousDays.some(day => day.date === date);

      if (!logExists) {
        setPreviousDays([
          { date, hours: "0h 0m", totalSeconds: 0 },
          ...previousDays,
        ]);
      }

      setCurrentDate(date);

      try {
        if (userId && token) {
          await startWorkLogSession(userId, token);
        }
      } catch (error) {
        console.error("Erro ao iniciar a sessão de trabalho:", error);
      }
    }
  };

  return (
    <Container fluid>
      <Col className="user">
        Usuário {name}
      </Col>
      <Button
        className="logout-button"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Sair <img src={logoutImg} alt="Botão sair"className="logoutImg" />
      </Button>
      <Row className="page-content">
        <Col lg="12">
          <Card className="body">
            <CardBody className="cardBodyContent">
              <Row>
                <Col md="12" className="header">
                  <h2>Ponto eletrônico</h2>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="current-hours">
                    <div className="time-container">
                      {previousDays.map((day, index) => {
                        const isCurrentDay = day.date === currentDate;
                        const timeToDisplay =
                          isCurrentDay && isClockIn
                            ? formatTime(day.totalSeconds + currentTime)
                            : isCurrentDay
                              ? formatTime(day.totalSeconds)
                              : null;

                        if (timeToDisplay !== null) {
                          return (
                            <div key={index}>
                              <div className="time-box">{timeToDisplay}</div>
                              <div className="timerTitle">Horas de hoje</div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="previous-days">
                    Dias anteriores
                    <div className="table-wrapper">
                      <Table responsive className="table">
                        <tbody>
                          {previousDays.map((day, index) => (
                            <tr key={index}>
                              <td>{day.date}</td>
                              <td>
                                {day.date === currentDate && isClockIn
                                  ? formatTime(day.totalSeconds + currentTime)
                                  : formatTime(day.totalSeconds)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Col>
              </Row>
              <Button className="start-button" onClick={handleClockIn}>
                {isClockIn ? "Hora de saída" : "Hora de entrada"}
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
