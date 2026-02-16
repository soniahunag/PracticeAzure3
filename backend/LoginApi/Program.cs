var builder = WebApplication.CreateBuilder(args);

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS: allow Vite dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173" , "http://localhost:4173", "https://orange-bay-0fd5cae00.4.azurestaticapps.net")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("LocalDev");

// optional: avoid 404 on /
app.MapGet("/", () => "LoginApi is running. Go to /swagger");

// POST /auth/login (fake auth)
app.MapPost("/auth/login", (LoginRequest req) =>
{
    if (req.Username == "demo" && req.Password == "1234")
    {
        return Results.Ok(new
        {
            token = "fake-jwt-token",
            user = new { name = "Demo User", role = "User" }
        });
    }

    return Results.Unauthorized();
});

// GET /me (fake token check)
app.MapGet("/me", (HttpRequest request) =>
{
    if (request.Headers.Authorization.ToString() == "Bearer fake-jwt-token")
        return Results.Ok(new { name = "Demo User", role = "User" });

    return Results.Unauthorized();
});

app.Run();

record LoginRequest(string Username, string Password);
