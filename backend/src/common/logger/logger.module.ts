import { Module, Scope, Logger, Global } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Global()
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
