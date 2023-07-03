const React = (function () {
  let hooks = [],
    currentHook = 0;

  return {
    render(Components) {
      const Comp = Components();
      Comp.render();
      currentHook = 0;
      return Comp;
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray;
      const deps = hooks[currentHook];
      const hasChangedDeps = deps
        ? !depArray.every((el, i) => el === deps[i])
        : true;
      if (hasNoDeps || hasChangedDeps) {
        callback();
        hooks[currentHook] = depArray;
      }
      currentHook++;
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue;
      const setStateHookIndex = currentHook;
      const setState = (newState) => (hooks[setStateHookIndex] = newState);
      return [hooks[currentHook++], setState];
    },
  };
})();

const Counter = () => {
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState("foo");

  React.useEffect(() => {
    console.log("effect : ", count, text);
  }, [count, text]);

  return {
    click: () => setCount(count + 1),
    type: (txt) => setText(txt),
    noop: () => setCount(count),
    render: () => console.log("render : ", { count, text }),
  };
};

let App;
App = React.render(Counter);

App.click();
App = React.render(Counter);

App.type("bar");
App = React.render(Counter);

App.noop();
App = React.render(Counter);

App.click();
App = React.render(Counter);
