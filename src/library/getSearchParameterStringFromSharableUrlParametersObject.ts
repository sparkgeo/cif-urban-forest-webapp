import { SharableUrlParameters } from '../types/topLevelAppTypes'

export function getSearchParameterStringFromSharableUrlParametersObject(
  sharableUrlParameters: SharableUrlParameters,
) {
  const sharableUrlParameterEntries = Object.entries(sharableUrlParameters)
  return sharableUrlParameterEntries.reduce<string>((previousValue, currentValue, currentIndex) => {
    const [keyName, value] = currentValue

    const accumulatorsInitialIndexValueIfNoInitialValueProvided = 0
    if (currentIndex === accumulatorsInitialIndexValueIfNoInitialValueProvided) {
      return `${keyName}=${value}`
    }
    return `${previousValue}&${keyName}=${value}`
  }, '')
}
