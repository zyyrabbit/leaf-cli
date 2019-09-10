module.exports = (api, {
  classComponent
}, _) => {

  api.extendPackage({
    devDependencies: {
      typescript: '^3.4.3'
    }
  })

  if (classComponent) {
    api.extendPackage({
      dependencies: {
        'vue-class-component': '^7.0.2',
        'vue-property-decorator': '^8.1.0'
      }
    })
  }

  api.render('./template', {
    isTest: false,
    hasMocha: false,
    hasJest: false
  })

}
