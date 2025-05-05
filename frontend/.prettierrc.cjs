module.exports = {
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'auto',
  printWidth: 80,
  singleQuote: true,
  overrides: [
    {
      files: ['**.*.scss', '*.scss'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
