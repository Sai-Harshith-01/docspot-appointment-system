import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      Doctor Appointment System ©2025
      <br />
      For support, call us at <strong>+91-98765-43210</strong>
    </Footer>
  );
};

export default AppFooter; 