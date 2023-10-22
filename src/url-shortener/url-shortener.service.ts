import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UrlMapping } from "./url-mapping.schema";
import { HelperService } from "../helpers/helpers.service";
import * as mongoose from "mongoose";

@Injectable()
export class UrlShortenerService {
  constructor(
    @InjectModel(UrlMapping.name)
    private urlMappingModel: mongoose.Model<UrlMapping>,
    private helper: HelperService
  ) {}

  async shortenUrl(url: string): Promise<string> {
    const isExist: UrlMapping = await this.urlMappingModel.findOne({
      longUrl: url,
    });

    const domainName = process.env.DOMAIN_NAME;

    if (isExist) {
      return `${domainName}/${isExist.shortUrl}`;
    }

    const shortId = this.helper.generateShortUrl();
    const shortUrl = `${domainName}/${shortId}`;

    await this.urlMappingModel.create({
      longUrl: url,
      shortUrl: shortId,
    });

    return shortUrl;
  }

  async getLongUrl(url: string): Promise<string | undefined> {
    const result: UrlMapping = await this.urlMappingModel.findOne({
      shortUrl: url,
    });

    if (!result) return undefined;

    result.accessTime.push(new Date());
    result.accessCount = result.accessCount + 1;

    await this.urlMappingModel.updateOne({ longUrl: result.longUrl }, result);

    return result.longUrl;
  }
}
