import * as assert from 'assert';
import { commands } from 'vscode';
import DuckModeOn from '../../commands/DuckModeOn';

suite('Duck Mode On Test Suite', () => {

  test('it has a command', () => {
    assert.strictEqual("duck-mode.duckOn", DuckModeOn.commandName);
  });

  test('it registers a command', async () => {
    await commands.getCommands(true).then(c => assert.strictEqual(true, c.includes(DuckModeOn.commandName)));
  });

  test('it executes when the command is called', async () => {

    const duckOn = new DuckModeOn();
    duckOn.onDidActivate(activeState => assert.equal(true, activeState));

    await commands.executeCommand(DuckModeOn.commandName);
  });
  
});

