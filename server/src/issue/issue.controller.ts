import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  Res,
} from '@nestjs/common';
import { AddIssueDto } from './dto/issue.addIssue.dto';
import { QueryIssueDto } from './dto/issue.query.dto';
import { SetIssueContentDto } from './dto/issue.setIssueContent.dto';
import { SetIssuePollDto } from './dto/issue.setIssuePoll.dto';
import { SetIssueRegiDto } from './dto/issue.setIssueRegi.dto';
import { SetIssueRegiStatusDto } from './dto/issue.setIssueRegiStatus.dto';
import { IssueService } from './issue.service';

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}

  // 이슈 등록
  @Post()
  @HttpCode(201)
  async addIssue(@Body() issueData: AddIssueDto, @Res() Res) {
    try {
      const issue = await this.issueService.addIssue(issueData);
      if (issue) {
        return Res.json({ message: 'success' });
      }
    } catch (err) {}
  }

  // 정치인 메인페이지, 등록된 이슈(10개 사건 그래프)
  @Get()
  @HttpCode(200)
  async getIssuesRegistered(@Query() issueQuery: QueryIssueDto) {
    try {
      const { targetPolitician, regiStatus, ranked, pageNum, perPage } =
        issueQuery;

      // 등록된 이슈
      if (regiStatus) {
        // const issues = await this.issueService.getIssuesRegistered(
        //   targetPolitician,
        //   pageNum,
        //   perPage,
        // );
        return 'regiStatus';
      }

      // 미등록 이슈 top 3
      else if (ranked) {
        // const issues = await this.issueService.getIssueNotRegisteredRanked(
        //   targetPolitician,
        // );
        return 'ranked';
      }

      // 미등록 이슈 나머지
      else {
        // const issues = await this.issueService.getIssueNotRegistered(
        //   targetPolitician,
        //   pageNum,
        //   perPage,
        // );
        return 'else';
      }
    } catch (err) {}
  }

  // 이슈 등록 투표
  @Patch(':/issueId/regi')
  @HttpCode(200)
  async setIssueRegi(
    @Param('issueId') id: string,
    @Body() regi: SetIssueRegiDto,
  ) {
    try {
      // const issue = await this.issueService.setIssueRegi(id, regi);
      return {};
    } catch (err) {}
  }

  // 이슈 여론 투표
  @Patch(':/issueId/poll')
  @HttpCode(200)
  async setIssuePoll(
    @Param('issueId') id: string,
    @Body() poll: SetIssuePollDto,
  ) {
    try {
      // const issue = await this.issueService.setIssuePoll(id, poll);
      return {};
    } catch (err) {}
  }

  // (관리자) 이슈 내용 수정
  @Patch(':/issueId/content')
  async setIssueContent(
    @Param('issueId') id: string,
    @Body() content: SetIssueContentDto,
  ) {
    try {
      // const issue = await this.issueService.setIssueContent(id, content);
      return {};
    } catch (err) {}
  }

  // (관리자) 이슈 상태 수정
  @Patch(':/issueId/regiStatus')
  async setIssueRegiStatus(
    @Param('issueId') id: string,
    @Body() regiStatus: SetIssueRegiStatusDto,
  ) {
    try {
      // const issue = await this.issueService.setIssueStatus(id, regiStatus);
      return {};
    } catch (err) {}
  }
}
