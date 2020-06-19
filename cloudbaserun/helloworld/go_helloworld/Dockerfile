# Use the official golang image to create a build artifact
FROM golang:1.13 as builder

# Create app directory
RUN mkdir /app

# Add file to /app/
ADD . /app/

# Build the binary
WORKDIR /app

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Run service on container startup
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

CMD ["/app/main"]
