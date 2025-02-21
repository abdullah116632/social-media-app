import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { CustomButton, Loading, TextInput } from "../components";
import { BgImage } from "../assets";
import { apiRequest } from "../utils";
import { UserLogin } from "../redux/userSlice";

const Register = () => {

  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id, token } = useParams();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try{
      const res = await apiRequest({
        url: "/users/reset-password",
        data: {...data, id, token},
        method: "POST"
      })

      console.log(res)

      if(!res?.success){
        setErrMsg(res);
      }else{
        setErrMsg(res);
        setTimeout(() => {
          window.location.replace("/login");
        }, 3000)
      }
      setIsSubmitting(false);
    }catch(err){
      console.log(err)
      setIsSubmitting(false);
    }
  };



  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex justify-center bg-primary rounded-xl overflow-hidden shadow-xl'>
        <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>

          <h3 className='text-ascent-1 text-base font-semibold'>
            Enter new password
          </h3>

          <form
            className='py-8 flex flex-col gap-5'
            onSubmit={handleSubmit(onSubmit)}
          >

            <div className='w-full flex flex-col gap-1 md:gap-2'>
              <TextInput
                name='password'
                label='Password'
                placeholder='Password'
                type='password'
                styles='w-full'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password?.message : ""}
              />

              <TextInput
                label='Confirm Password'
                placeholder='Password'
                type='password'
                styles='w-full'
                register={register("cPassword", {
                  validate: (value) => {
                    const { password } = getValues();

                    if (password != value) {
                      return "Passwords do no match";
                    }
                  },
                })}
                error={
                  errors.cPassword && errors.cPassword.type === "validate"
                    ? errors.cPassword?.message
                    : ""
                }
              />
            </div>

            {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status == "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type='submit'
                containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                title='Confirm'
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;