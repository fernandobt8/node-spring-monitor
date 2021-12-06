import RSelect from 'react-select'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'
import styled from 'styled-components'
import { colors } from '../theme/colors'

const customStyles = {
  option: (provided, state) => {
    return {
      ...provided,
      color: colors.primary,
      backgroundColor: state.isSelected ? colors.blue : state.isFocused ? colors.secondary : colors.background,
    }
  },
  singleValue: (provided, state) => ({
    ...provided,
    color: colors.primary,
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    color: colors.primary,
    backgroundColor: 'transparent',
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent',
    boxShadow: state.isFocused ? `0 0 2px 2px ${colors.blue}` : 'none',
    outline: 'none',
    border: `2px solid ${colors.primary}`,
    borderColor: colors.primary,
    borderRadius: '5px',
  }),
  menu: provided => ({
    ...provided,
    marginTop: '1px',
  }),
}

interface Props extends StateManagerProps {
  width?: string
}

export function Select(props: Props) {
  return <SelectCss {...props} styles={customStyles} />
}

const SelectCss = styled(RSelect)<{ width? }>`
  ${p => p.width && `width: ${p.width};`}
  text-align: left;

  > div {
    background-color: var(--backgroundColor);
    border-color: var(--primaryColor) !important;
  }

  #react-select-3-listbox > div > div:active {
    background-color: var(--secondaryColor);
  }
`
