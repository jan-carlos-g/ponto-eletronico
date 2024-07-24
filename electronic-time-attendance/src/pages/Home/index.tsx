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
    if (isClockIn) {
      intervalId = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isClockIn && currentTime !== 0) {
      setCurrentTime(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isClockIn]);

  useEffect(() => {
    const fetchWorkLogs = async () => {
      if (userId && token) {
        try {
          const workLogs = await getWorkLogs(userId, token);
          const formattedLogs = workLogs.map((log: WorkLog) => ({
            date: formatDate(log.date),
            hours: formatTime(log.hours),
            totalSeconds: log.hours,
          }));
          const uniqueLogs = formattedLogs.reduce((acc: any, log: WorkLog) => {
            if (!acc.find((existingLog: { date: string; }) => existingLog.date === log.date)) {
              acc.push(log);
            }
            return acc;
          }, [] as PreviousDay[]);

          const now = new Date();
          const today = formatDate(now.toISOString());

          // Check if the current date is in the previous days
          const todayLogExists = uniqueLogs.some((log: { date: string; }) => log.date === today);
          
          if (!todayLogExists) {
            // If there's no log for today, add it with 0 hours
            uniqueLogs.unshift({
              date: today,
              hours: "0h 0m",
              totalSeconds: 0
            });
          }

          setPreviousDays(uniqueLogs);

          const activeSession = await getActiveWorkLogSession(userId, token);

          if (activeSession) {
            const now = new Date();
            const sessionDate = new Date(activeSession.startTime);

            const nowUTC = new Date(now.toISOString());
            const sessionDateUTC = new Date(sessionDate.toISOString());

            const initialTime = Math.floor((nowUTC.getTime() - sessionDateUTC.getTime()) / 1000);
            setCurrentTime(initialTime);
            setCurrentDate(formatDate(activeSession.startTime));
            setIsClockIn(true);

          } else {
            setCurrentTime(0);
          }

        } catch (error) {
          console.error("Error fetching work logs:", error);
        }
      }
    };
    fetchWorkLogs();
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
          console.log("Tempo de saída registrado com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao registrar o tempo de saída:", error);
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
          console.log("Sessão de trabalho iniciada com sucesso!");
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
        Sair <img src={logoutImg} className="logoutImg" />
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
                              <div className="time-box">
                                {timeToDisplay}
                              </div>
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
