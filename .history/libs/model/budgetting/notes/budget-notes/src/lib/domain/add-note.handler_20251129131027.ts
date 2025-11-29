import { AddNoteToBudgetCommand } from './add-note.command';
import { ICommandHandler } from './types';


export class AddNoteToBudgetHandler
  implements ICommandHandler<AddNoteToBudgetCommand>
{
  constructor(
    private readonly toolkit: any
  ) {}
 
  async execute(command: AddNoteToBudgetCommand): Promise<void> {
    
    if (!command.budgetId) throw new Error('Budget ID is required.');

    if (!command.content || command.content.trim().length === 0)
      throw new Error('Note content cannot be empty.');

    const repo = this.toolkit.getRepository('budget-notes');

    // --- Step 3: Prepare data ---
    const note = {
      budgetId: command.budgetId,
      content: command.content.trim(),
      authorId: command.authorId,
      createdAt: command.createdAt,
    };

    // --- Step 4: Save to repository ---
    await repo.addNote(note);

    // Optional: Logging
    this.toolkit.logger?.info?.('Added note to budget', note);
  }
}
