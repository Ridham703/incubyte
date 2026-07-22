import request from "supertest";
import app from "../app.js";

describe("Health Check API Endpoint", () => {
  it("GET /api/v1/health - should return 200 OK with success status and message", async () => {
    const res = await request(app).get("/api/v1/health");
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Car Dealership Inventory API is healthy and operational");
    expect(res.body.timestamp).toBeDefined();
  });
});
