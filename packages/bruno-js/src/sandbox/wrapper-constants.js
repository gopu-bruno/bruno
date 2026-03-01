// Wrapper templates that sandwich user scripts before VM execution (Node VM and QuickJS).
// Line offsets are computed from the prefix strings so error-formatter.js can map
// VM-reported line numbers back to the original .bru/.yml source lines.

// -- Node VM --

const NODEVM_SCRIPT_PREFIX = `
        (async function(){
          `;

const NODEVM_SCRIPT_SUFFIX = `
        })();
      `;

// -- QuickJS --

const QUICKJS_SCRIPT_PREFIX = `
      (async () => {
        const setTimeout = async(fn, timer) => {
          v = await bru.sleep(timer);
          fn.apply();
        }

        await bru.sleep(0);
        try {
          `;

const QUICKJS_SCRIPT_SUFFIX = `
        }
        catch(error) {
          throw error;
        }
        return 'done';
      })()
    `;

// Computed offsets — number of newlines before user script in each wrapper
const NODEVM_SCRIPT_WRAPPER_OFFSET = NODEVM_SCRIPT_PREFIX.split('\n').length - 1;
const QUICKJS_SCRIPT_WRAPPER_OFFSET = QUICKJS_SCRIPT_PREFIX.split('\n').length - 1;

const wrapInNodeVmClosure = (script) => NODEVM_SCRIPT_PREFIX + script + NODEVM_SCRIPT_SUFFIX;
const wrapInQuickJSClosure = (script) => QUICKJS_SCRIPT_PREFIX + script + QUICKJS_SCRIPT_SUFFIX;

module.exports = {
  wrapInNodeVmClosure,
  wrapInQuickJSClosure,
  NODEVM_SCRIPT_WRAPPER_OFFSET,
  QUICKJS_SCRIPT_WRAPPER_OFFSET
};
