# 🌾 KrishiMitra AI — Smart Farming Assistant

**KrishiMitra AI** (Farmer's Friend) is an AI-powered agricultural assistant designed to help Indian farmers make informed farming decisions using machine learning, weather information, market prices, and conversational assistance.

**Crop Disease Detection · Weather Forecasting · Market Prices · AI Farming Advice**

## 🚀 Features

- 🔬 **Crop Disease Detection:** Analyze plant-leaf images using the existing MobileNetV2 model.
- 🌦️ **Weather Forecasting:** Access weather information to support agricultural planning.
- 📈 **Agricultural Market Prices:** Explore commodity prices and compare available market information.
- 🤖 **AI Farming Assistant:** Ask agricultural questions through the chatbot.
- 📱 **Responsive Interface:** Use the application on desktop, tablet, and mobile devices.
- 🎨 **Modern User Interface:** An improved frontend designed for a more accessible and engaging farming experience.

## 🧠 About the Project

KrishiMitra AI aims to make agricultural technology more accessible to farmers by bringing several useful capabilities into one application.

The platform combines an AI-powered plant disease detection workflow with weather information, agricultural market insights, and farming assistance.

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- Axios

### Backend

- Python
- FastAPI
- Uvicorn

### Machine Learning

- TensorFlow / Keras
- MobileNetV2
- Image classification

### Integrations

- Weather API
- Agricultural market data API
- AI farming chatbot

_The actual availability of individual integrations depends on the project's current configuration._

## 📁 Project Structure

```text
Krishimitra_AI/
├── backend/
│   ├── app/
│   │   └── api/
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
├── run_all.bat
├── run_backend.bat
├── run_frontend.bat
└── README.md
```

_This structure illustrates the main application files; additional directories and files may exist in the repository._

## ⚙️ Prerequisites

Install the following tools before running the project:

- Python compatible with the backend dependencies
- Node.js and npm
- Git

## 💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rigs29/Krishimitra_AI.git
cd Krishimitra_AI
```

### 2. Set up the backend

Follow the backend's dependency instructions and install the packages listed in its requirements file, if present.

Start the FastAPI application using the entry point and command configured for your project.

For example, if `backend/main.py` exposes the FastAPI application as `app`:

```bash
cd backend
uvicorn main:app --reload
```

If your backend uses a different entry point, adjust the command accordingly.

### 3. Set up the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

### 4. Configure environment variables

Configure the required API URLs and credentials using environment variables or local configuration files as appropriate for your implementation.

**Security:** Never commit API keys, passwords, access tokens, or other secrets to GitHub.

## 🔍 Core Modules

### Plant Disease Detection

Upload a plant-leaf image and submit it to the existing backend for model-based prediction.

### Weather Forecasting

View weather information provided by the configured weather service.

### Agricultural Market Prices

Explore agricultural market information returned by the configured market-data service.

### AI Farming Assistant

Interact with the application's existing chatbot to ask agricultural questions.

## 🌱 Future Enhancements

Potential improvements include:

- Multilingual support for Indian languages.
- Voice-based farming assistance.
- Soil analysis and crop recommendations.
- Improved accessibility for rural users.
- Additional agricultural advisory capabilities.

## 👨‍💻 Author and Contributions

Developed as an AI-powered smart farming project.

Repository: [Krishimitra_AI](https://github.com/rigs29/Krishimitra_AI)

Contributions, suggestions, and feedback are welcome.

## 📄 License

Refer to the repository's `LICENSE` file for licensing terms.
