import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Politician, PoliticianDocument } from 'src/schemas/politician.schema';
import { PoliticianDto } from './dto/politician.dto';

@Injectable()
export class PoliticianService {
  constructor(
    @InjectModel(Politician.name)
    private readonly politicianModel: Model<PoliticianDocument>,
  ) {}

  async getAllPoliticians() {
    const politicians = await this.politicianModel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          party: 1,
          issues: 1,
          counts: 1,
        },
      },
      {
        $lookup: {
          from: 'issues',
          localField: '_id',
          foreignField: 'targetPolitician',
          as: 'count',
          pipeline: [
            {
              $match: {
                regiStatus: 'active',
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'issues',
          localField: '_id',
          foreignField: 'targetPolitician',
          as: 'issues',
          pipeline: [
            {
              $match: {
                regiStatus: 'active',
              },
            },
            {
              $project: {
                issueDate: 1,
                totalPolls: { $add: ['$poll.total.pro', '$poll.total.neu', '$poll.total.con'] },
                score: { $subtract: ['$poll.total.pro', '$poll.total.con'] },
              },
            },
            { $sort: { totalPolls: -1 } },
            { $limit: 40 },
            { $sort: { issueDate: 1 } },
          ],
        },
      },
    ]);

    return politicians;
  }

  sortPoliticians(politicians: Array<PoliticianDto>): Array<PoliticianDto> {
    return politicians.sort((a, b) => {
      return b.count[0].count - a.count[0].count;
    });
  }

  deleteProperty(politicians: Array<PoliticianDto>): Array<PoliticianDto> {
    for (const politician of politicians) {
      delete politician.count;
    }
    return politicians;
  }

  async addPolitician(politician: PoliticianDto): Promise<Politician> {
    const result = await new this.politicianModel(politician).save();
    return result;
  }
}
