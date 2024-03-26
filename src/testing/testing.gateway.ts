import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  BaseWsExceptionFilter,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ArgumentsHost,
  Catch,
  Injectable,
  Logger,
  UseFilters,
} from '@nestjs/common';
import { ParticipantEntity } from './entities/participant.entity';
import { QuestionEntity } from '../quiz/entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthTestingMode } from './enum/auth-testing-mode.enum';
import { TestingEntity } from './entities/testing.entity';

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}

@Injectable()
@WebSocketGateway({ cors: { origin: true }, path: '/testing' })
@UseFilters(new AllExceptionsFilter())
export class TestingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(ParticipantEntity)
    private participantRepository: Repository<ParticipantEntity>,

    @InjectRepository(TestingEntity)
    private testingRepository: Repository<TestingEntity>,
  ) {}

  logger: Logger = new Logger('TestingGateway');

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const isValidUUID = (uuid) => {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidPattern.test(uuid);
    };

    const disconnect = () => {
      this.logger.error(
        `The client ${client.id} cannot connect because of incorrect or missing participantKey`,
      );
      client.disconnect();
    };

    const [mode, accessKey] = String(
      client.handshake.headers.authorization,
    ).split(' ');
    if (isValidUUID(accessKey)) {
      if (mode === AuthTestingMode.PARTICIPANT) {
        const participant = await this.participantRepository.findOne({
          where: { accessKey },
        });
        if (participant) {
          this.logger.log(`The client ${client.id} is connected`);
        } else disconnect();
      } else if (mode === AuthTestingMode.CONDUCTOR) {
        const testing = await this.testingRepository.findOne({
          where: { accessKey },
        });
        if (testing) {
          this.logger.log(`The client ${client.id} is connected`);
        } else disconnect();
      } else disconnect();
    } else disconnect();
  }

  afterInit(server: Server): void {
    this.logger.log('TestingGateway is initialized');
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`The client ${client.id} is disconnected`);
  }

  addNewParticipantToRoom(participant: ParticipantEntity) {
    this.logger.log(`Been added a new participant ${participant.name}`);
    this.server.emit(
      `addNewParticipantToRoom_${participant.testing.id}`,
      participant,
    );
  }

  removeParticipantToRoom(participantId: number, testingId: number) {
    this.server.emit(`removeParticipantToRoom_${testingId}`, participantId);
  }

  updateParticipantToRoom(participant: ParticipantEntity) {
    this.server.emit(
      `updateParticipantToRoom_${participant.testing.id}`,
      participant,
    );
  }

  // @SubscribeMessage('msgToServer')
  // onNewMessage(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() msg: any,
  // ): void {
  //   console.log(msg, client.id);
  //   this.server.emit('msgToClient', msg);
  // }

  startTesting(id: number) {
    this.server.emit(`startTesting_${id}`, { start: true });
  }

  nextQuestion(testingId: number, question: QuestionEntity) {
    this.server.emit(`nextQuestion_${testingId}`, { question });
  }

  endTesting(id: number) {
    this.server.emit(`endTesting_${id}`, { end: true });
  }
}
