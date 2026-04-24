# ImagingHub

## Setting up developer environment

### Clone the repo

```
git clone https://github.com/DiamondLightSource/ImagingHub
```

### Setup frontend

#### Add local env file

In `frontend/`, add an `.env.local` file with the following contents:
```
VITE_API_BASE_URL = "http://localhost:8000"
VITE_KEYCLOAK_URL = "https://identity-test.diamond.ac.uk"
VITE_KEYCLOAK_REALM = "dls"
VITE_KEYCLOAK_CLIENT_ID = "ImagingHubDev"
VITE_KEYCLOAK_SCOPE = "openid profile posix-uid email"
```

#### Install dependencies and generate code from GraphQL schema

```
cd ImagingHub/frontend
npm i
npm run relay
npm run dev
```

### Setup backend

```
cd ImagingHub/backend
pip install -r requirements.txt
pip install tomobar --no-deps
pip install httomolibgpu --no-deps
pip install httomo_backends --no-deps
uvicorn main:app --reload
```
