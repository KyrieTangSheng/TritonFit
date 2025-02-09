tritonfit/
├── frontend/                      # React Native app
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── screens/             # Main app screens
│   │   ├── navigation/          # React Navigation setup
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # API calls and business logic
│   │   ├── utils/              # Helper functions
│   │   ├── assets/             # Images, fonts, etc.
│   │   ├── constants/          # App constants
│   │   └── types/              # TypeScript interfaces/types
│   ├── .env                    # Environment variables
│   └── package.json
│
├── backend/                     # FastAPI server
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/        # API endpoints
│   │   │   └── dependencies.py
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── services/          # Business logic
│   │   └── utils/             # Helper functions
│   ├── tests/
│   │   ├── api/
│   │   └── services/
│   ├── .env
│   └── requirements.txt
│
├── .gitignore
└── README.md