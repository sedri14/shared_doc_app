import { useGlobalContext } from "../../../context";
import ShowItems from "../ShowItems/ShowItems";

const HomeComponent = () => {
  const { inodes } = useGlobalContext();
  return (
    <div className="col-md-12 w-100 center">
      <ShowItems
        title={"Created Folders"}
        items={inodes.filter((inode) => inode.type === "DIR")}
      />
      <ShowItems
        title={"Created Files"}
        items={inodes.filter((inode) => inode.type === "FILE")}
      />
    </div>
  );
};

export default HomeComponent;
