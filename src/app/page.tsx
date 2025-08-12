"use client";

import { Button } from "@/components/ui/button"
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";


export default function Home() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = () => {
        authClient.signUp.email({
            email,
            name,
            password,
        }, {
            onError: () => {
                window.alert("Something went wrong");
            },
            onSuccess: () => {
                window.alert("Success")
            }
        }
        )
    }

    return (
        <div className="p-4 flex flex-col gap-y-4">
            <Input
                placeholder="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button onClick={onSubmit}>
                Create User
            </Button>
        </div>
    )
}
