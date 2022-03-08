import React from "react";
import * as Yup from "yup";
import { Formik, FastField, Form } from "formik";
import UserApi from "../../api/UserApi";
import { ReactstrapInput } from "reactstrap-formik";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
} from "reactstrap";
import { useParams } from "react-router-dom";
import { toastr } from "react-redux-toastr";

const NewPassword = (props) => {

  const {token} = useParams();

  const showNotification= (title,message)=>{
    const options = {
      timeOut: 3000,
      type: "success",
      showCloseButton: true,
      progressBar: true,
      position: "top-right"
    };

    toastr.success(title,message,options);
  }

  const redirectToLogin = () => {
    props.history.push("/auth/sign-in");
  };

  return (
    <React.Fragment>
      <div className="text-center mt-4">
        <h1 className="h2">Reset password</h1>
        <p className="lead">Enter your new password.</p>
      </div>

      <Formik
        initialValues={{
          password:'',
          confirmPassword:''
        }}
        validationSchema={Yup.object({
          password: Yup.string()
            .min(6, "Must be between 6 and 50 characters.")
            .max(50, "Must be between 6 and 50 characters.")
            .required("Required"),

          confirmPassword: Yup.string()
            .required("Required")
            .when("password", {
              is: (val) => (val && val.length > 0 ? true : false),
              then: Yup.string().oneOf(
                [Yup.ref("password")],
                "Both password need to be the same"
              ),
            }),
        })}
        onSubmit={async (values) => {
          try {
            // call api
            await UserApi.resetPassword(token,values.password);
            showNotification("Reset Password","Reset Password Successfully!");
            redirectToLogin();
          } catch (error) {
            props.history.push("/auth/500");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Card>
            <CardBody>
              <div className="m-sm-4">
                <Form>
                  <FormGroup>
                    <FastField
                      label="Password"
                      type="password"
                      bsSize="lg"
                      name="password"
                      placeholder="Enter new password"
                      component={ReactstrapInput}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FastField
                      label="Confirm Password"
                      type="password"
                      bsSize="lg"
                      name="confirmPassword"
                      placeholder="Enter confirm new password"
                      component={ReactstrapInput}
                    />
                  </FormGroup>

                  <div className="text-center mt-3">
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      Reset password
                    </Button>
                  </div>
                </Form>
              </div>
            </CardBody>
          </Card>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default NewPassword;
