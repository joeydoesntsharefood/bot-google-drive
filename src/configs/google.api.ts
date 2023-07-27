import { config } from 'dotenv';

config();

const server = Number(process.env.SERVER ?? 3000);

export const credentials = {
  type: 'service_account',
  project_id: 'iris-bot-389718',
  private_key_id: 'd04fc52359b5e9b5822eac62439b0a75dc03ee2f',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDeeSek55/gDv8f\ndn/B8tnckFzprh8mvU2OVhgMB7s+nSk9uazOtuHzCjRImgZ1oUFQB21AXSDxAuyx\nzrFWLAGdvTVQzs++WSYtnxwtIplRK5mHmrjOBHrhIdHkp100Vsu86ZarVix+QmL2\n2/BbgLVhYhAaVGKNrSTghurdIJW1+ctGU13vEpsU3bd222/hRrZUvtJ5v8+pDUHH\njuwXxDhHBJoM+/1IGjxGEkBSM7rMTnTH4vIMa9yoHL8soJUniFpON0NsmV8Wo6ty\nNxsBD856GDo1PwvrurdsFAa+NVP+uzOeDjcK7bzSXYcaHuSfEP5mWeCJz8EpoFXo\niwWJM0XNAgMBAAECggEAGdYiJ4GKzJ+RO1ssrR6B9J6DW9QP5BTZ++y9sC/5q+Te\nlD+K9RrCFNKbjc7tbx3CEwQ5yN7H45V+XYvuhl5n9aSym2bZM3bw+x1eTVOWUJnq\no5fxXGOizaB62r4hEeH+mTrbd5xzYFpfWeHjAQ1qgxu7WQNxyphQDw88GWAeYtqf\nJ/gIe4a8xyOgAqezirRCtc11pWHh/XJddW+7AeupM1XG3pGJY+62pPbHIfyMlYSv\nA8RBRAr5yhLGrcW+153w4rV0WfjLPRYJDMIyl/lh7xwngUCSbfv+KzyRe5U7IfHG\nwVU64jHjTEqXcFnGKrD0Gxsw8TbqYFJHF4SYX/qZ1QKBgQD5Uzgw0qxe23XDFH9s\n3wVOa7YzxrYT7JHYg0Cmr0xnTzegkAdtSqOwddXV4fNJscP1TO50Ok8etPFmQh/g\nkMOzsDaB/18QFpS6ztbPSUmK1AJ2ia9OD9SZwINcTs9qUOliwZfxzgT0QX9ykHgH\n2sLTyX0wuFmDCsNfO6kO2dl+RwKBgQDkbecxsz9PB9jua9q1zTgKkc+gUbZwcujD\nc0nIXOiXlf1Er37wvmSZWINQ81+rhrzMfZHNwyuDfVvTD9LscgMHIRpRCTl166p/\n7rYfLbwtOx7+URzrr3xcU1B3CPQzXleG9dLcnf03n9bKVvS2Ef/WDQ9oVD3Zgjvv\nuDp2WJsBSwKBgFfL7E+VAEnu8gseHrkR1+aDm4ekA94EQl+B6LRJqpf+l1IdJeBg\nlj+/XuuQQ4HB7YVl79pR5iakBRXDV0JW9/NArBEfAjTCHuGhkJcx8YnHmo5vcaIF\nhRIXbqqEvhlsIKM8FOt7Ztc0cVLAeOQbLtwxabpMUIkKsz3H3oJySFplAoGBAMmn\nWAShB49+DvyTTBVYYFO8Wv1dhWAJoQACA62Uj2RabaY4AykF+wsAf5Rz9Q4YOQ2R\nAKkT1ZMTlH9jpcFD+PZPO8s0CHzYGcEse6xUlJ2dZoP+GTjaxz898XfT+LhsXXpw\nAsDt2/9B5LzlPMyKYT6WcvaX/63HcZ/zE/Er0VK3AoGAO7W7JjmWdpk0zpGRliKg\nUlB7bQx8TipQGoNNOnHrTZ/x+pIekLDyPqO7KNWMtniSV0Uce0ls6PMVSttJxi2v\nfZt7YDPn8JsYbDF7UkFb7MqW6tKMA7OYzx+lalBWCB3JD0e/T1XxpPNiBAbOl5o4\n+dBsKydbX6tA+SsiGJfFaFg=\n-----END PRIVATE KEY-----\n',
  client_email: 'googledrive@iris-bot-389718.iam.gserviceaccount.com',
  // client_id: '102011354240425046791',
  client_id:
    '310032106831-a5l2devc6haor7rdm11qdtlblpdiiipo.apps.googleusercontent.com',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/googledrive%40iris-bot-389718.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
  client_secret: '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',
  // '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'
  redirect_uris: [
    `http://localhost:${server}/oauth2callback/`,
    'http://localhost:3000/oauth2callback',
  ],
};
