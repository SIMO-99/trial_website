import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient, getToken } from "../utility";

const Login = () => {

    const [username, setUsername] = useState("");
    const [pwd, setPwd] = useState("");
    const a = useClient();

    const navigate = useNavigate()

    useEffect(() => {
        if (getToken() !== undefined)
            navigate("/players");
    });

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await a.post("/login", { username: username, password: pwd });

            const token = response.data.token;
            const role = response.data.user.is_admin;


            localStorage.setItem("user", JSON.stringify({ token: token, is_admin: role }));

            navigate(0);



        } catch (e) { console.log(e) }
    }

    return (

        <div className="container w-25 background py-5">
            <br /> <br />

            <form onSubmit={handleSubmit}>

                <div className="form-floating my-1">
                    <input
                        type="text"
                        autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-control"
                        placeholder="Username" />
                    <label htmlFor='floatingInput'>Username</label>

                </div>

                <div className="form-floating my-1">
                    <input
                        type="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                        className="form-control"
                        placeholder="Password" />
                    <label htmlFor="floatingPassword">Password</label>

                </div>

                <div className="form-floating my-2">
                    <button className="btn w-100 btn-primary btn-block">Login</button>
                </div>
            </form>
        </div>

    )
}

export default Login
