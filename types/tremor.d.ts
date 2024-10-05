import { SearchSelectItemProps as TremorSearchSelectItemProps } from "tremor-react"

declare module "@tremor/react" {
    interface SearchSelectItemProps extends TremorSearchSelectItemProps {
        // disabled is actually a valid prop for SearchSelectItem, but it is not defined in the type.
        disabled?: boolean
    }
}
