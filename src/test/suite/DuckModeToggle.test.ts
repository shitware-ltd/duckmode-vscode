import * as assert from 'assert';
import { commands } from 'vscode';
import DuckModeToggle from '../../commands/DuckModeToggle';
import State from '../../DuckModeState';

suite('Duck Mode Toggle Test Suite', () => {

  test('it has a command', () => {
    assert.strictEqual("duck-mode.toggle", DuckModeToggle.commandName);
  });

  test('it registers a command', async () => {
    await commands.getCommands(true).then(c => assert.strictEqual(true, c.includes(DuckModeToggle.commandName)));
  });

  test('it executes when the command is called', async () => {
    const state: State = {
      extensionActive : false,
      duckModeActive: false
    }

    const duckToggle = new DuckModeToggle(state);
    duckToggle.onDidActivate(activeState => 
      assert.equal(true, activeState)
    );

     await commands.executeCommand(DuckModeToggle.commandName);
  });
});
