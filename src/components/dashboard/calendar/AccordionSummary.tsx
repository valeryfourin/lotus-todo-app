import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

export const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
	expandIcon={<ExpandMoreIcon/>}
	{...props}
	/>
))(() => ({
	'& .MuiAccordionSummary-root': {
		WebkitJustifyContent: 'flex-start',
		justifyContent: 'flex-start',
		padding: 0,
	},
	'& .MuiAccordionSummary-content': {
		WebkitFlexGrow: 'unset',
    	flexGrow: 'unset',
		margin: 0,
	}
}));
