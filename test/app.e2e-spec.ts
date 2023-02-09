import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { createServer, Server } from 'http';
import { AddressInfo } from 'net';

const mockResult: any[] = [
  {
    id: '10-56-brewing-company-knox-test',
    name: '10-56 Brewing Company',
    brewery_type: 'micro',
    street: '400 Brown Cir',
    address_2: null,
    address_3: null,
    city: 'Knox',
    state: 'Indiana',
    county_province: null,
    postal_code: '46534',
    country: 'United States',
    longitude: '-86.627954',
    latitude: '41.289715',
    phone: '6308165790',
    website_url: null,
    updated_at: '2023-01-04T04:46:02.393Z',
    created_at: '2023-01-04T04:46:02.393Z',
  },
  {
    id: '10-barrel-brewing-co-bend-1-test',
    name: '10 Barrel Brewing Co',
    brewery_type: 'large',
    street: '62970 18th St',
    address_2: null,
    address_3: null,
    city: 'Bend',
    state: 'Oregon',
    county_province: null,
    postal_code: '97701-9847',
    country: 'United States',
    longitude: '-121.28170597038259',
    latitude: '44.08683530625218',
    phone: '5415851007',
    website_url: 'http://www.10barrel.com',
    updated_at: '2023-01-04T04:46:02.393Z',
    created_at: '2023-01-04T04:46:02.393Z',
  },
  {
    id: '10-barrel-brewing-co-bend-2-test',
    name: '10 Barrel Brewing Co',
    brewery_type: 'large',
    street: '1135 NW Galveston Ave Ste B',
    address_2: null,
    address_3: null,
    city: 'Bend',
    state: 'Oregon',
    county_province: null,
    postal_code: '97703-2465',
    country: 'United States',
    longitude: '-121.32880209261799',
    latitude: '44.057564901366796',
    phone: '5415851007',
    website_url: null,
    updated_at: '2023-01-04T04:46:02.393Z',
    created_at: '2023-01-04T04:46:02.393Z',
  },
];

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  let status: number;
  let response: string;

  beforeAll(async () => {
    server = createServer((req, res) => {
      res.writeHead(status);
      res.end(response);
    });
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        console.log('Server is UP !!');
        resolve();
      });
    });

    const { port } = server.address() as AddressInfo;

    process.env['OPEN_BREWERY_DB_URL'] = `http://127.0.0.1:${port}/`;
  });

  afterAll(async () => {
    server.close((err) => {
      console.log('Server is DOWN !!');
      if (err) console.error(err);
    });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ service: 'brewery', version: '0.0.1' });
  });

  it('/brewery (GET)', async () => {
    status = 200;
    response = JSON.stringify(mockResult);
    const result = await request(app.getHttpServer()).get('/brewery');
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(3);
  });

  it('/brewery (GET) Thirdparty replies with 400', async () => {
    status = 400;
    response = JSON.stringify({ error: 'Test error' });
    const result = await request(app.getHttpServer()).get('/brewery');
    expect(result.status).toBe(400);
  });
});
