module.exports = class PromptModuleAPI {
  constructor (creator) {
    this.creator = creator;
  }

  injectFeature (feature) {
    this.creator.featurePrompt.choices.push(feature);
  }

  injectPrompt (prompt) {
    if (Array.isArray(prompt)) {
      this.creator.injectedPrompts.push(...prompt);
      return;
    }
    this.creator.injectedPrompts.push(prompt);
  }

  onPromptComplete (cb) {
    this.creator.promptCompleteCbs.push(cb)
  }
}
