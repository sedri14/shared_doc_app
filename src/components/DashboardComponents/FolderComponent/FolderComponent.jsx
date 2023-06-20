import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../../context";
import ShowItems from "../ShowItems/ShowItems";

const FolderComponent = () => {
  const { folderId } = useParams();
  const { inodes } = useGlobalContext();

  return (
    <>
      <div>
        {inodes.length > 0 ? (
          <>
            <ShowItems
              title={"Folders"}
              items={inodes.filter((inode) => inode.type === "DIR")}
            />
            <ShowItems
              title={"Files"}
              items={inodes.filter((inode) => inode.type === "FILE")}
            />
          </>
        ) : (
          <p className="text-center my-5"> Empty Folder</p>
        )}
      </div>
    </>
  );
};

export default FolderComponent;
