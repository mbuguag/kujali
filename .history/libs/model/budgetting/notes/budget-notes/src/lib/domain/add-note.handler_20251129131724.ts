import { FunctionHandler, HandlerToolkit } from '@iote/cqrs/functions';

import { AddNoteToBudgetCommand } from './add-note.command';

type AddNoteToBudgetResult = void;

/**
 * Handler responsible for processing the command to add a note to a budget.
 * Extends the project's base FunctionHandler for serverless deployment.
 */
export class AddNoteToBudgetHandler extends FunctionHandler<
  AddNoteToBudgetCommand,
  AddNoteToBudgetResult
> {
  // NOTE: No constructor needed as dependencies (toolkit) are passed via execute()

  async execute(
    command: AddNoteToBudgetCommand,
    toolkit: HandlerToolkit
  ): Promise<void> {
    // 1. Basic Validation
    if (!command.budgetId) {
      // Use toolkit logger for better integration
      toolkit.logger?.error?.('Budget ID is missing in command.');
      throw new Error('Budget ID is required.');
    }

    if (!command.content || command.content.trim().length === 0) {
      toolkit.logger?.error?.('Note content is empty or invalid.');
      throw new Error('Note content cannot be empty.');
    }

    // 2. Data Access (using getRepository from the HandlerToolkit) [cite: 85]
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
