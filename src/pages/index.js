import React from "react";
import Layout from "@theme/Layout";

import Hero from "../components/Home/Hero/Hero";
import Stats from "../components/Home/Stats/Stats";
import Modules from "../components/Home/Modules/Modules";

export default function Home() {
  return (
    <Layout
      title="Data Visualisation Guide"
      description="Interactive learning guide"
    >
      <Hero />
      <Stats />
      <Modules />
    </Layout>
  );
}