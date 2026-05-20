# Base image for running the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 80

# SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["backend/BallAndBeeWEB.Api.csproj", "backend/"]
RUN dotnet restore "backend/BallAndBeeWEB.Api.csproj"
COPY backend/ backend/
WORKDIR "/src/backend"
RUN dotnet build "BallAndBeeWEB.Api.csproj" -c Release -o /app/build

# Publish the app
FROM build AS publish
RUN dotnet publish "BallAndBeeWEB.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BallAndBeeWEB.Api.dll"]
