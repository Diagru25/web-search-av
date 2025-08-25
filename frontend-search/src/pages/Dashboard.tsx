import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, Row, Col, Statistic, Typography, Spin, message } from "antd";
import {
  BugOutlined,
  SafetyOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import ApexCharts from "apexcharts";
import { dashboardAPI } from "../services/api";

const { Title } = Typography;

interface DashboardStats {
  totalMalware: number;
  totalCollectionUnits: number;
  malwareThisMonth: number;
  lastUpdateValue: number | null;
  lastUpdateUnit: string | null;
}

interface TopCollectionUnit {
  name: string;
  count: number;
}

interface MalwareByDay {
  date: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topUnits, setTopUnits] = useState<TopCollectionUnit[]>([]);
  const [malwareByDays, setMalwareByDays] = useState<MalwareByDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const barChartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);
  const barChartInstance = useRef<ApexCharts | null>(null);
  const lineChartInstance = useRef<ApexCharts | null>(null);

  const renderBarChart = useCallback(() => {
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }

    const options = {
      chart: {
        type: "bar" as const,
        height: 300,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          dataLabels: {
            position: "top" as const,
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      xaxis: {
        categories: topUnits.map((unit) => unit.name),
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      colors: ["#1890ff"],
      grid: {
        show: true,
        borderColor: "#f0f0f0",
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " mã độc";
          },
        },
      },
      series: [
        {
          name: "Số lượng mã độc",
          data: topUnits.map((unit) => unit.count),
        },
      ],
    };

    barChartInstance.current = new ApexCharts(barChartRef.current, options);
    barChartInstance.current.render();
  }, [topUnits]);

  const renderLineChart = useCallback(() => {
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy();
    }

    const options = {
      chart: {
        type: "line" as const,
        height: 300,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        curve: "smooth" as const,
        width: 3,
      },
      xaxis: {
        categories: malwareByDays.map((day) =>
          new Date(day.date).toLocaleDateString("vi-VN", {
            month: "short",
            day: "numeric",
          })
        ),
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
          },
        },
        title: {
          text: "Số lượng",
        },
      },
      colors: ["#52c41a"],
      grid: {
        show: true,
        borderColor: "#f0f0f0",
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " mã độc";
          },
        },
      },
      markers: {
        size: 4,
        colors: ["#52c41a"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
      series: [
        {
          name: "Số lượng mã độc",
          data: malwareByDays.map((day) => day.count),
        },
      ],
    };

    lineChartInstance.current = new ApexCharts(lineChartRef.current, options);
    lineChartInstance.current.render();
  }, [malwareByDays]);

  useEffect(() => {
    fetchDashboardData(true); // Initial load với loading spinner
  }, []);

  // Auto refresh mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(false); // Auto refresh không có loading spinner
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Cleanup charts khi component unmount
  useEffect(() => {
    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartsLoading && topUnits.length > 0 && barChartRef.current) {
      renderBarChart();
    }
  }, [chartsLoading, topUnits, renderBarChart]);

  useEffect(() => {
    if (!chartsLoading && malwareByDays.length > 0 && lineChartRef.current) {
      renderLineChart();
    }
  }, [chartsLoading, malwareByDays, renderLineChart]);

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
      setChartsLoading(true);
    }

    try {
      // Fetch all data in parallel
      const [statsData, topUnitsData, malwareByDaysData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getTopCollectionUnits(),
        dashboardAPI.getMalwareByDays(),
      ]);

      setStats(statsData);
      setTopUnits(topUnitsData);
      setMalwareByDays(malwareByDaysData);
      setLastUpdate(new Date().toLocaleTimeString("vi-VN"));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (showLoading) {
        message.error("Không thể tải dữ liệu dashboard");
      } else {
        // Silent error cho auto refresh, chỉ log console
        console.warn("Auto refresh failed, data not updated");
      }
    } finally {
      if (showLoading) {
        setLoading(false);
        setChartsLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2} style={{ marginTop: 0, marginBottom: 0 }}>
          Trang chủ
        </Title>
        {lastUpdate && (
          <span style={{ color: "#999", fontSize: "12px" }}>
            Cập nhật lần cuối: {lastUpdate}
          </span>
        )}
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng mã độc"
              value={stats?.totalMalware || 0}
              prefix={<BugOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số đơn vị"
              value={stats?.totalCollectionUnits || 0}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Cập nhật trong tháng"
              value={stats?.malwareThisMonth || 0}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Cập nhật gần đây"
              value={
                stats && stats.lastUpdateValue !== null
                  ? stats.lastUpdateValue
                  : "N/A"
              }
              prefix={<ClockCircleOutlined />}
              suffix={
                stats && stats.lastUpdateValue !== null
                  ? stats.lastUpdateUnit
                  : ""
              }
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>
      {/* biểu đồ */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Thống kê top 5 đơn vị thu thập mã độc" size="small">
            {chartsLoading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin />
              </div>
            ) : (
              <div style={{ padding: "10px" }}>
                {topUnits.length > 0 ? (
                  <div ref={barChartRef} style={{ height: "300px" }} />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#999",
                      padding: "20px",
                    }}
                  >
                    Chưa có đơn vị thu thập nào
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Thống kê mã độc theo ngày (7 ngày gần nhất)"
            size="small"
          >
            {chartsLoading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin />
              </div>
            ) : (
              <div style={{ padding: "10px" }}>
                {malwareByDays.length > 0 ? (
                  <div ref={lineChartRef} style={{ height: "300px" }} />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#999",
                      padding: "20px",
                    }}
                  >
                    Chưa có dữ liệu
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
