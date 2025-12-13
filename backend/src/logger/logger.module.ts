import { Module, Scope, Logger } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: Logger,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: (parentClass: object) => {
        return new Logger(parentClass?.constructor?.name || 'Unknown');
      },
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
