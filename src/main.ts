import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["https://url-shortener-react-dusky.vercel.app"], // specify the allowed domain
    methods: "GET,POST",
  });

  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 4000;
  await app.listen(port, "0.0.0.0");
}
bootstrap();
