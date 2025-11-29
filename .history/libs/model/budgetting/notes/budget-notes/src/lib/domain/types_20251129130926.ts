/**
 * Minimal Command Handler interface.
 * Generic type ensures type-safe command execution.
 */
export interface ICommandHandler<TCommand> {
  execute(command: TCommand): Promise<void>;
}
