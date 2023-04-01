import * as assert from 'assert';
import { Uri } from 'vscode';
import DuckModeManager from '../../DuckModeManager';

suite('DuckMode Manager Test Suite', () => {
  const subscriptions: { dispose(): any }[] = [];

  teardown(() => {
    subscriptions.forEach(d => d.dispose())
    subscriptions.length = 0;
  })

  test('duck mode is inactive by default', () => {
    const fakeUri = Uri.file('foo');
    const manager = new DuckModeManager(fakeUri);

    assert.strictEqual(false, manager.state.duckModeActive);
  });

  test('it activates and deactivates DuckMode', async () => {
    const fakeUri = Uri.file('foo');
    const manager = new DuckModeManager(fakeUri);
    assert.strictEqual(false, manager.isExtensionActive);

    manager.activate();
    assert.strictEqual(true, manager.isExtensionActive);

    manager.deactivate();
    assert.strictEqual(false, manager.isExtensionActive);
  });


  /*
  test('duck mode can be toggled on and off', async () => {
    const manager = new DuckModeManager();
    await manager.subscribe(subscriptions)

    await vscode.commands
      .executeCommand(DuckModeToggle.commandName)

    assert.strictEqual(true, manager.duckModeActive);

    await vscode.commands
      .executeCommand(DuckModeToggle.commandName)

    assert.strictEqual(false, manager.duckModeActive);
  });
  */
});