import * as clc from 'cli-color';

export const DebugLogger = (o: any, ...out: any[]) => {
  const formats = {
    middleware: {
      indent: 2,
      symbol: '[M:]',
      color: 'green'
    },
    guard: {
      indent: 2,
      symbol: '[G:]',
      color: 'magenta'
    },
    interceptor: {
      indent: 2,
      symbol: '[I:]',
      color: 'yellow'
    },
    pipe: {
      indent: 2,
      symbol: '[P:]',
      color: 'cyan'
    },
    filter: {
      indent: 2,
      symbol: '[E:]',
      color: 'red'
    },
    service: {
      indent: 2,
      symbol: '[S:]',
      color: 'blue'
    }
  };

  let prefix = '';
  let typeFormat = {
    indent: 0,
    symbol: '',
    color: 'white'
  };

  if ('intercept' in o) {
    typeFormat = formats.interceptor;
  } else if ('use' in o) {
    typeFormat = formats.middleware;
  } else if ('canActivate' in o) {
    typeFormat = formats.guard;
  } else if ('transform' in o) {
    typeFormat = formats.pipe;
  } else if ('catch' in o) {
    typeFormat = formats.filter;
  } else if ('server' in o) {
    typeFormat = formats.service;
  }

  prefix = '>'.repeat(typeFormat.indent) + ' ' + typeFormat.symbol + ' ' + o.constructor.name + ' ';

  console.log(clc[typeFormat.color](prefix) + out.join(''));
};
