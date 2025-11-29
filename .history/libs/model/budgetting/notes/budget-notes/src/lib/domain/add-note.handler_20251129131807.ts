import { FunctionHandler, HandlerToolkit } from '@iote/cqrs/functions';

import { AddNoteToBudgetCommand } from './add-note.command';

type AddNoteToBudgetResult = void;


export class AddNoteToBudgetHandler extends FunctionHandler<
  AddNoteToBudgetCommand,
  AddNoteToBudgetResult
> {

  async execute(
    command: AddNoteToBudgetCommand,
    toolkit: HandlerToolkit
  ): Promise<void>
  {
    if (!command.budgetId) {

        toolkit.logger?.error?.('Budget ID is missing in command.');
      throw new Error('Budget ID is required.');
    }

    if (!command.content || command.content.trim().length === 0) {
      toolkit.logger?.error?.('Note content is empty or invalid.');
      throw new Error('Note content cannot be empty.');
    }

    // The handler is now stateless and receives its dependencies via the execute method.
    const repo = toolkit.getRepository('budget-notes');

    const notePayload = {
      budgetId: command.budgetId,
      content: command.content.trim(),
      authorId: command.authorId,
      createdAt: command.createdAt,
    };

    // 3. Execution (Repository Call)
    await repo.addNote(notePayload);

    toolkit.logger?.info?.('Successfully added note to budget', {
      noteId: notePayload.budgetId,
    });
  }
}
