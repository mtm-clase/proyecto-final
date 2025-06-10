import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"
 
export function BuyButton() {
    return <Button asChild>
        <Link to="/adquire">Buy</Link>
    </Button>
}