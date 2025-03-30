# ChainFusion

## Bridge Your Web2 Apps to Web3 with AI Agents

Bringing traditional Web2 applications into the decentralized Web3 ecosystem is a complex and resource-intensive process. Businesses and developers face numerous challenges:

- *Lack of Blockchain Expertise:* Transitioning requires specialized knowledge of smart contracts, decentralized storage, and tokenization.
- *Time and Cost Constraints:* Manual system architecture planning and deployment can take months, consuming significant resources.
- *Uncertainty in Technology Choices:* With the rapidly evolving blockchain landscape, staying updated with secure and scalable solutions is challenging.
- *Deployment Complexities:* Setting up blockchain nodes, deploying smart contracts, and integrating tools like WalletConnect demand advanced technical skills.

### How Bridge AI Solves These Problems

Bridge AI simplifies the Web2 to Web3 transition by automating crucial tasks and providing AI-driven guidance throughout the process.

## Tech Stack

- *Frontend:* Next.js
- *Backend:* Python
- *Blockchain:* Hardhat, Scaffold-Eth2, CDP-Kit
- *AI & Automation:* LangChain, LangGraph, AI Agents
- *Development Environment:* Replit

## Project Structure

The project is organized into two main directories:

- *Frontend/*: React-based web application
- *Backend/*: Python-based backend server

### Frontend

The frontend is built using modern web technologies and includes:

- Package management with Yarn
- Modern development tooling and linting
- Organized component structure
- GitHub workflows and Husky for git hooks

#### Frontend Setup

Navigate to the Frontend directory:
sh
cd Frontend

Install dependencies:
sh
yarn install

Start the development server:
sh
yarn dev


### Backend

The backend is built with Python and includes:

- RESTful API routes
- Docker support for containerization
- Store management
- Custom agents
- Script utilities

#### Backend Setup

Navigate to the Backend directory:
sh
cd Backend

Set up a Python virtual environment:
sh
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

Install dependencies:
sh
pip install -r requirements.txt

Start the server:
sh
python main.py


#### Docker Setup (Optional)

The backend can also be run using Docker:
sh
docker-compose up --build


## AI Agents

The system leverages AI agents to automate various aspects of Web3 integration:

1. *System Architect* - Automates system design and architecture planning for Web3 applications.
2. *Research Analyst* - Gathers and analyzes blockchain trends, security risks, and best practices.
3. *Smart Contract Developer* - Assists in writing, testing, and deploying secure smart contracts.

## Development

- The frontend development server typically runs on: http://localhost:3000
- The backend API server runs on the port specified in main.py
- Use the provided linting and formatting tools to maintain code quality

## Pictures

![3](https://github.com/user-attachments/assets/0fef2006-5cf0-43a5-b931-31e588f2faa6)
![1](https://github.com/user-attachments/assets/926bc5c3-0a04-42fa-97c0-b3aafc7ce02c)
![6](https://github.com/user-attachments/assets/6e829bb6-4d6b-4e39-93ad-cab8c90b9ea4)
![5](https://github.com/user-attachments/assets/78084eaa-a5bf-4aee-b80f-9f1400d96069)
![2](https://github.com/user-attachments/assets/80bcb2b7-df1f-4804-be97-e719516c60fd)
![4](https://github.com/user-attachments/assets/d3713452-6b79-4dae-a477-e099d360aad6)








## Contributing

Please refer to the CONTRIBUTING.md file in the Frontend directory for guidelines on contributing to this project.

## License

This project is licensed under the terms specified in the LICENSE file in the Frontend directory.
