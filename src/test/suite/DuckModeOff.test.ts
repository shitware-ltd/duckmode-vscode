import * as assert from 'assert';
import { commands } from 'vscode';
import DuckModeOff from '../../commands/DuckModeOff';

suite('Duck Mode Off Test Suite', () => {

  test('it has a command', () => {
    assert.strictEqual("duck-mode.duckOff", DuckModeOff.commandName);
  });

  test('it registers a command', async () => {
    await commands.getCommands(true).then(c => assert.strictEqual(true, c.includes(DuckModeOff.commandName)));
  });

  test('it executes when the command is called', async () => {

    const duckOff = new DuckModeOff();
    duckOff.onDidActivate(activeState => 
      assert.strictEqual(false, activeState)
    );

    await commands.executeCommand(DuckModeOff.commandName);
  });
  
});

