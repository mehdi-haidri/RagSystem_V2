
import { DbConnection } from "@/db/DbConnection";
import User from "@/models/User";
export async function POST(req) {

    const { theme , user_id} = await req.json();

    await DbConnection();
    const user = await User.findOne({ _id: user_id });
    user.PreferedTheme = theme;
    await user.save();

    if (!user) { 
        return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json({ message: "Theme updated successfully" }, { status: 200 });
    
}