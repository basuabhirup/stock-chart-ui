# Stock Chart UI 📈

**A stock chart visualization app using NYSE data powered by the Alpha Vantage API.**

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Usage](#usage)

## Overview

This project provides an interactive platform to visualize NYSE stock data using charts. Powered by the Alpha Vantage API, this app allows users to track stock movements and trends.

## Features

- Real-time NYSE stock data visualization.
- Interactive and responsive charts.
- Simple and intuitive UI.

## Tech Stack

- **Vite**: Used as the build tool and development environment, allowing for fast compilation and hot module replacement during development.
- **React**: Utilized for creating a dynamic and responsive user interface, ensuring that components are efficiently rendered based on stock data.
- **Tailwind CSS**: Applied for styling with utility-first CSS classes, ensuring a clean and responsive design throughout the app without writing custom CSS.
- **TypeScript**: Provides type safety and autocompletion, helping to minimize errors and improve the development process across the codebase.
- **Alpha Vantage API**: Integrated to fetch real-time NYSE stock data, which is then processed and displayed within the app.
- **Apex Charts**: Implemented for rendering stock charts, taking advantage of its powerful charting capabilities to create interactive and visually appealing data visualizations.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/stock-chart-ui.git
```

Navigate into the project directory:

```bash
cd stock-chart-ui
```

Install the dependencies:

```bash
npm install
```

## Running Locally

To run the project locally, follow these steps:

1. **Set up environment variables:**

   Create a `.env` file in the root directory and add your Alpha Vantage API key:

   ```env
   VITE_API_KEY=your_alpha_vantage_api_key
   VITE_API_BASE_URL="https://www.alphavantage.co/query"
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Access the app:**

   Open your browser and navigate to `http://localhost:5173` to view the app.

## Usage

Once the app is running, you can start exploring NYSE stock data. Simply select a stock symbol and the chart will display the relevant data.


