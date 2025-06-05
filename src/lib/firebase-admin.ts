import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin
const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: 'tips-6545c',
      clientEmail: 'firebase-adminsdk-fbsvc@tips-6545c.iam.gserviceaccount.com',
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3X2INEWGhs4TR\ncCeEWQmr901sehcM5MV29D9c6IUn7m/q0bExwx9gVUaoeAgiZP2w1RBjTH84JNav\n+W0XiZw6Y5UKKd9svWZ08wUMB5SC/5WyWRFnyzeF2EPjcSItuF15Vl3nIKDRrQy7\n3SMc6G1AKQp2EWoiudztVcUVSAocMNGajy7j0hUdw+7EOodgMWx1RxhAwDCRVJg+\nOlb8fXnA7dqkFvNexn39rIcli+41UnwIuPR+vqv5m/ZIL5dgDCA40dqlX09YSmuD\n0R4vg//jq7s1tLVeEG8pY9tI/i5VasOujGIb2c5b3vUegveYEQeDxCZS8bHdEHf1\n0HlJH4HTAgMBAAECggEAHLp9VpXICXjiEJv1HPeEG+SBRUL1dIgs5Z+Lg8dMAT8K\nWqwiiizLMCD8Em3HvHe9BSTETgJQlh+zYNt/e2YMS1uJoI+B2PvtXtoqCsHvQvy+\n27O3ld7RIo+Ix0vUsnwFbPqaeJj0iRUG/zG8jA1f/GLRqEC/M5SR5779wwFH0DWT\nc07Or4aU13rrteAfVm6p0CDiIhvO6Wrf1L6L62heQnRoD7T633TuHFaJXv8CNgH4\n2nV5nmPF1QtUtBs5iVlDONw4oPLC5ZXjnO9cw+RYSC2/eUkl5W98SR5j3x6LZ5q8\n72XSbD9zwSntFEoM3vbcuoeJ9ZrJCpSippplpGcKBQKBgQDy9C6RdtQ5wji01zJK\nADi8UgivNgt91wtTnKBYt4+lhy7UZIznlecLLqu9TtUgWgeomJAnCaCYXL2KPE+t\nv0TB93nU0tNUjo72JpKxEWwLPj9BqnU2O1BtqtleTLDCMOqeD+R+93c4F9h9e3Vr\n9DH3Jm8LoOcvLcwev5CbNdiF9QKBgQDBOCeLGqf0EJBLnviTlFsRVPSTujYDSw2C\nhkpaX4AelI+GzNVxChCwhg7Lq6UvC5IQJtxLKSlkA5BgHhPbZuOnKAnIe6IJakGr\nBkcsORSykrLB2VKkAnb1f7iNYPi/zTs7JWM2tBb9bFzHir1ufjd1jtrx84i3yGuG\nZaiRUu1DpwKBgQDVFthVW3zun+vuqSSBhUo92lGlo2hW2iskDacRyQYjr7qiLQLt\nCCxaQXf+FUuXEX/QHueoZahGmmjf+uADy1O6MJ3ZzYPvkQ3Q1aopxdcW0WTX6nLd\nuw5i8cuvCuKpoA/XzKajudcGCtwlywgFRGwiksIo19qNJcT3XxutFoAvlQKBgAUZ\nuGGBqKFWtphob+NlbSn99h7YMYjQuGCTru7HypgED+3dBl1fiKVARK+3rjqZsZdf\njz0krwUG2w7OfHO0OZo2Alwad2KMPYOIPOS79QHpwXJAjF/r+LvuTS7eOnLFtiSP\njhjplBnIfIJ/9RQvnMMrrDfq19cSIVSA5nw/lifNAoGAK/fnXFqsLHzJ7BlR4mF2\nvo5L607ndTTQ0+aLpnuLELErZ97QBjD1wTezz7Usdcc6D3EQG+SrUyNztKZADk2Y\nKRixxSeMJY1iu4doSNlgF9sAguVFdQfVEFBpOck0FSpRuD9qcxF1PbgrPge1/bDy\nid5cetmM4ojb+Kz72suIJDA=\n-----END PRIVATE KEY-----\n"
    }),
    storageBucket: 'tips-6545c.appspot.com',
  });
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage(); 