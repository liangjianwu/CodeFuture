import * as React from 'react';
import {Typography,Card,CardMedia,CardContent,CardActions,Button} from '@mui/material';
import {Title} from '../../Component/MuiEx';
import { useNavigate } from 'react-router';

const MerchantInfo = ( props )=> {
  return (
    <React.Fragment>
      <Title>Bussiness</Title>            
      <Typography component="p" variant="text.main">
        {props.merchant.merchant_name}
      </Typography>
      <Typography component="p" variant="text.main">
        {props.superadmin && props.superadmin.name}
      </Typography>
    </React.Fragment>
  );
}

const ServiceCardItem = (props) => {
    const {service,myservices,onApply} = props
    const inService = myservices && myservices.indexOf(service.id) !== -1
    const navigate = useNavigate()
    const handleApply = ()=>{
        window.confirm('Are you sure to apply the service!') && onApply && onApply(service)
    }
    return (
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            height="140"
            image={props.service.image?props.service.image:"/crm.jpg"}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {service.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {service.description}
            </Typography>
          </CardContent>
          <CardActions>
            {inService && <Button size="small" color="success" variant="contained" onClick={()=>navigate(service.url)}>Enter</Button>}
            {!inService && <Button size="small" variant="contained"  onClick={handleApply}>Apply</Button>}
            <Button size="small" onClick={()=>navigate(service.helpurl)}>Learn More</Button>
          </CardActions>
        </Card>
      );
}
export {MerchantInfo,ServiceCardItem}