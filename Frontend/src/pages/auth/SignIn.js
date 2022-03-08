import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Formik, FastField, Form } from "formik";
import { ReactstrapInput } from "reactstrap-formik";
import LoginApi from "../../api/LoginApi";
import * as Yup from "yup";
import { Button, Card, CardBody, FormGroup, CustomInput,Modal,
  ModalHeader,
  ModalBody,
  ModalFooter } from "reactstrap";
import avatar from "../../assets/img/avatars/vti_avatar.jpg";
import storage from "../../storage/Storage";
import { toastr } from "react-redux-toastr";
import { useState } from "react";
import UserApi from "../../api/UserApi";
import { setUserLoginInfo } from "../../redux/actions/UserLoginInfoActions";
import { setTokenInfo } from "../../redux/actions/UserLoginInfoActions";
import { connect } from "react-redux";

const SignIn = (props) => {

  const [isOpenModal, setOpenModal] = useState(false);

  const [email, setEmail] = useState("");

  const [isDisableResendButton, setDisableResendButton] = useState(false);

  const resendEmailToActiveAccount = async () => {
    setDisableResendButton(true);
    await UserApi.resendEmailToActiveAccount(email);
    setDisableResendButton(false);
  };

  const showErrorNotification = (title, message) => {
    const options = {
      timeOut: 3000,
      type: "success",
      showCloseButton: true,
      progressBar: true,
      position: "top-right",
    };
  
    toastr.error(title, message, options);
  };

  //Check for remember me
  const [checkedRememberMe,setCheckedRememberMe] = useState(storage.isRememberMe());

  return (
    <React.Fragment>
      <div className="text-center mt-4">
        <h2>Welcome to VTI</h2>
        <p className="lead">Sign in to your account to continue</p>
      </div>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string()
            .min(6, "Must be between 6 and 50 characters.")
            .max(50, "Must be between 6 and 50 characters.")
            .required("Required"),

          password: Yup.string()
            .min(6, "Must be between 6 and 50 characters.")
            .max(50, "Must be between 6 and 50 characters.")
            .required("Required"),
        })}
        onSubmit={async (values) => {
          try {
            const result = await LoginApi.login(
              values.username,
              values.password
            );

            //Check user active
            if (result.token === null || result.token === undefined) {
              setEmail(result.email);
              setOpenModal(true);
            } else {
              //Set remember me
              storage.setRememberMe(checkedRememberMe);

              //Save token to storage
              storage.setToken(result.token);
              //Save userInformation to storage
              storage.setUserInfo(
                result.userName,
                result.email,
                result.firstName,
                result.lastName,
                result.role,
                result.status
              );

              //Save token, user info to redux
              props.setTokenInfo(result.token);
              props.setUserLoginInfo(
                result.userName,
                result.email,
                result.firstName,
                result.lastName,
                result.role,
                result.status
              );

              //Redirect to homepage
              props.history.push("/dashboard/default");
            }

          } catch (error) {
            if (error.status === 401) {
              //Show error notification
              showErrorNotification(
                "Login Fail!!!",
                "Wrong Username or Password!"
              );
            } else {
              //Redirect to error server page
              props.history.push("/auth/500");
            }
          }
        }}
        // validateOnChange={false}
        // validateOnBlur={false}
      >
        {({ isSubmitting }) => (
          <Card>
            <CardBody>
              <div className="m-sm-4">
                <div className="text-center">
                  <img
                    src={avatar}
                    alt="Chris Wood"
                    className="img-fluid rounded-circle"
                    width="132"
                    height="132"
                  />
                </div>
                <Form>
                  <FormGroup>
                    <FastField
                      label="UserName"
                      type="text"
                      bsSize="lg"
                      name="username"
                      placeholder="Enter your username"
                      component={ReactstrapInput}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FastField
                      label="Password"
                      type="password"
                      bsSize="lg"
                      name="password"
                      placeholder="Enter password"
                      component={ReactstrapInput}
                    />
                    <small>
                      <Link to="/auth/reset-password">Forgot password?</Link>
                    </small>
                  </FormGroup>

                  {/* Remember me */}
                  <div>
                    <CustomInput
                      type="checkbox"
                      id="rememberMe"
                      label="Remember me next time"
                      defaultChecked={checkedRememberMe}
                      onChange ={() => setCheckedRememberMe(!checkedRememberMe)}
                    />
                  </div>

                  <div className="text-center mt-3">
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      Sign in
                    </Button>
                  </div>
                </Form>
              </div>
            </CardBody>
          </Card>
        )}
      </Formik>

      <Modal isOpen={isOpenModal}>
        <ModalHeader>You need to confirm your account</ModalHeader>

        <ModalBody className="m-3">
          <p className="mb-0">
            Your account is not active.
          </p>
          <p className="mb-0">Please check your email (<b>{email}</b>) to active account.</p>
        </ModalBody>

        <ModalFooter>
          <Button
            color="primary"
            onClick={resendEmailToActiveAccount}
            disabled={isDisableResendButton}
          >
            Resend
          </Button>{" "}
          <Button color="primary" onClick={()=> setOpenModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(connect(null,{ setUserLoginInfo, setTokenInfo })(SignIn));