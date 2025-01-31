import * as admin from 'firebase-admin';

const serviceAccount = {
  type: "service_account",
  project_id: "filmgo-microservice-69402",
  private_key_id: "d9f83e11ebe173e13ce20c5444f0a21fb013693d",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCvMESpG465Zm4B\nKtGAIFXTdmIhJvgwnt+r6OzaJm1OhrpzIDDP9JRvZgtTJFdSGFFPAp7YAnzZfN7d\nP/DWORp16GEhdgouEHUOBoZFQriP2iOaEbp5e+w7xUwPoK4y+oJSzYuDQF6hw7qu\nfb8tKuGUcSN7dPfnMZDSrkpVcL+zEiOGmBv/CRLqgacJ/q4kB2PdJ/SEjSSAysd+\nLvajO7P3/enEs27N+dycrvLH3TNhYSiikf6ZOAu4YrG6FoPge7sgst8aupfF1PMn\nUKzgkbF8zVYG3U0BDoi+DMNd11bJBG2+jBFpQwxuUbXJiw+uGajcXu49c8nK1sAs\nO1eqhBn9AgMBAAECggEAC7tsNGAC/kxgsbrRRhGZoHxP2jUEJNYVmBYUpeUHZ8gd\nh0ALYiMuEp9vQuLkPHxM66vlq9p6ISLb66Nl007b2bQVgc+9eElusWEDT8hGAw+N\nLVBNID10kVR8lsUAYtZvG7D7YW+SNtFHDfr1WTFt4x/y4Uhwy/6VhTUaB3VHcpbi\nuFX1iEHyL36bGg1PWf49447Q2Xxb2HxVVO6nHlVyfHrA0ItwuTa/o2wJiQ27jOJm\ng+GyrG22owAQWdymYYhWvZQP0ywZc1UVeqzg5+pPJmzvlWKN4Znebjh/R9k1pNeT\ncIyZuDCJLMBNrDvjShjgb5w3TCAorYJkZAiAxVZPIQKBgQDgzRK4Xa88GyIDwZy2\nnDdmAvGSa8rvvDZd4kZVr58rRreSVUd1S9b6yQvg2MsKjNcJ4zk/35y9zSIBJK7d\nehqniRM0uMU0uRciwtwigL0D0giZRihEi+YuL++FtNjZ+zRqkbWVmSST8PMCm54L\n6HUADUoTkTzyI9Y20yPxP09g4QKBgQDHgITAGkv+hBVWAeSG4As4u3xM6l7I7pXf\nJnb1JmH/OcKBm+bqfok8/orIkgkZD2Bs/5pQItVcqeXxnCMOSY/L5/4nb4AFtpLE\nyNFxmfyPzHy63hZLlv9+GywDNYrqFu3saPA61lcnmGbWGz4V4Q7IIdiP7wSM2Hwv\nSHbVHJuwnQKBgHmgOpqphV/dxj+GB0X9qzN0MENqMrgWesu82xUNGe8OKc/wd+MM\nj1nMYLLcWK5ymP3uhFD8qQ8/5z/7GukVYUp3rX5+4aOu6MeT6gp44MsqXiCfhrXf\ng0BGCy+qMxFtCmUGRNqVquaoHLKyg4Yp1POcPRHtKK5RmVq8Tdv+xvHBAoGAZZaQ\nArJhWC0yICW+lN+pVy5BUXlW4sJ7FrKjiJoO9MQYw577qxTcFW8YhKG4eEZYN6jA\nj2Xtd84cBTgYscHLs21jAfnJGx+pBQOtg0eCUEc0jINinwM4/qIfe1Lcde9PID8f\ndRaIMuVsGEKvDr0Xpdl2SXTQwFfMhNdFi6eRsBECgYBFmItoSmqL1+0cpuNUfaZE\nsqeHqtsKjbGhCE8uGzbXnwc7/swr7qXtBvzJopOT866hbwkOS8oEInxNVtXgDRAI\nOJONVzUII84rICW0d9LTW5PXxhQ7pzPpGRQGqt2lGLDSTEqhmmIfhKs6ctXxBEYs\nOLh9bORUggvnhY9YJZPeTg==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@filmgo-microservice-69402.iam.gserviceaccount.com",
  client_id: "117501666127532682625",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40filmgo-microservice-69402.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
  console.log('Firebase Admin initialized successfully');
}

export default admin;