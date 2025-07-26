import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../authSlice";
import { useNavigate } from "react-router-dom";

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(logoutUser()).then(() => {
            navigate("/login", { replace: true });
        });
    }, [dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
}

export default Logout;
